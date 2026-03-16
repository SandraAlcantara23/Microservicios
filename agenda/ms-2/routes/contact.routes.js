const router = require("express").Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth.middleware");

router.use(auth);


router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message || "Error creating contact" });
  }
});


router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching contacts" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const updated = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Error updating contact" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Contact.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ message: "Contact not found" });

    res.status(200).json({ message: "Deleted", id: deleted._id });
  } catch (err) {
    res.status(400).json({ message: "Invalid id" });
  }
});

module.exports = router;