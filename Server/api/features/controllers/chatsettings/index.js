const Chatsetting = require('../../../models').chat_setting;
const path = require('path');
const fs = require('fs');
const util = require('util');

const getSetting = async (req, res, next) => {
    const settings = await Chatsetting.findOne({});
    const settingsjson = settings.toJSON();
    const icon = settingsjson.chaticon;
    const supporticon = settingsjson.supporticon;
    if (icon) {
        settingsjson.chaticon = process.env.HTTP_HOST ? `https://${process.env.HTTP_HOST}/uploads/chaticons/${icon}` : `http://localhost:3001/uploads/chaticons/${icon}`
    }
    if (supporticon) {
        settingsjson.supporticon = process.env.HTTP_HOST ? `https://${process.env.HTTP_HOST}/uploads/chaticons/${supporticon}` : `http://localhost:3001/uploads/chaticons/${supporticon}`
    }

    res.json({ message: "Chat Settings Fetched Successfuly", data: settingsjson });
};



const renameFile = util.promisify(fs.rename);

const update = async (req, res, next) => {
    try {
        // File paths for icons
        let iconfilepath = null;
        let supporticonfilepath = null;

        // Handle Chat Icon upload
        if (req.files['iconfile']) {
            const iconFile = req.files['iconfile'][0];
            iconfilepath = await moveAndReplaceFile(iconFile, '../../../uploads/chaticons', 'iconfile');
        }

        // Handle Support Icon upload
        if (req.files['supporticonfile']) {
            const supportIconFile = req.files['supporticonfile'][0];
            supporticonfilepath = await moveAndReplaceFile(supportIconFile, '../../../uploads/chaticons', 'supporticonfile');
        }

        // Check if chat settings already exist
        const isExist = await Chatsetting.findOne({});

        if (isExist) {
            // Update existing settings
            await Chatsetting.update({
                chaticon: iconfilepath || isExist.chaticon, // Preserve old values if no new files
                chattitle: req.body.title,
                supporticon: supporticonfilepath || isExist.supporticon, // Preserve old values if no new files
                welcomemessage: req.body.welcomemessage
            }, {
                where: { id: isExist.id }
            });

            const updatedSetting = await Chatsetting.findOne({ where: { id: isExist.id } });
            return res.json({ message: "ChatSettings updated successfully", data: updatedSetting });
        } else {
            // Create new settings
            const newSetting = await Chatsetting.create({
                chaticon: iconfilepath,
                chattitle: req.body.title,
                supporticon: supporticonfilepath,
                welcomemessage: req.body.welcomemessage
            });
            return res.json({ message: "ChatSettings created successfully", data: newSetting });
        }
    } catch (error) {
        console.error('Error updating chat settings:', error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

// Move and replace file helper
const moveAndReplaceFile = async (file, destinationDir, filename) => {
    try {
        const fileExtension = path.extname(file.originalname);
        const destinationFilePath = path.join(__dirname, destinationDir, filename + fileExtension);
        const uploadedFilePath = file.path;

        // Rename (move) file to new location
        await renameFile(uploadedFilePath, destinationFilePath);

        console.log(destinationFilePath, 'file successfully moved and replaced');
        path.join(destinationDir, filename + fileExtension);
        return filename + fileExtension;
    } catch (error) {
        console.error(`Failed to move the file to ${destinationDir}:`, error);
        throw new Error('File moving failed');
    }
};

module.exports = { update };


module.exports = {
    getSetting,
    update,
};