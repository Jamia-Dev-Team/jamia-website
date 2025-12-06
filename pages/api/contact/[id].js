// pages/api/contact/[id].js
const { getPool } = require("../../../utils/db");

module.exports = async (req, res) => {
  const pool = getPool();
  const {
    query: { id },
    method,
  } = req;

  // basic ID validation
  const contactId = parseInt(id, 10);
  if (Number.isNaN(contactId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid contact ID",
    });
  }

  switch (method) {
    // ✅ GET single contact
    case "GET": {
      try {
        const selectQuery = `
          SELECT id, name, email, phone, subject, message, status, created_at, updated_at
          FROM contacts
          WHERE id = $1;
        `;
        const result = await pool.query(selectQuery, [contactId]);

        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Contact not found" });
        }

        return res.status(200).json({
          success: true,
          data: result.rows[0],
        });
      } catch (error) {
        console.error("Error fetching contact:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }

    // ✅ PATCH – update status (mark as read, etc.)
    case "PATCH": {
      try {
        const { status } = req.body;

        const allowedStatuses = ["new", "read", "closed"];
        if (!status || !allowedStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
          });
        }

        const updateQuery = `
          UPDATE contacts
          SET status = $1,
              updated_at = NOW()
          WHERE id = $2
          RETURNING id, name, email, phone, subject, message, status, created_at, updated_at;
        `;

        const result = await pool.query(updateQuery, [status, contactId]);

        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Contact not found" });
        }

        return res.status(200).json({
          success: true,
          message: "Status updated successfully",
          data: result.rows[0],
        });
      } catch (error) {
        console.error("Error updating contact status:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }

    // ✅ DELETE – remove message
    case "DELETE": {
      try {
        const deleteQuery = `
          DELETE FROM contacts
          WHERE id = $1
          RETURNING id;
        `;
        const result = await pool.query(deleteQuery, [contactId]);

        if (result.rows.length === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Contact not found" });
        }

        return res.status(200).json({
          success: true,
          message: "Contact deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting contact:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({
        success: false,
        message: `Method ${method} not allowed`,
      });
    }
  }
};
