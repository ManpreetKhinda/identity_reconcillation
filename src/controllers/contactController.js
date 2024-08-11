const { identifyContact } = require("../services/contactService");

const identify = async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {
    const result = await identifyContact(email, phoneNumber);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  identify,
};
