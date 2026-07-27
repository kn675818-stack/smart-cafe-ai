const Contact = require("../models/Contact");


// POST Contact Message
exports.createContact = async (req, res) => {
    try {
        const contact = await Contact.create(req.body);

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET All Contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: contacts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE Contact
exports.deleteContact = async (req, res) => {
    try {

        await Contact.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};