// import Poster from '../../../../models/Poster'
// import dbConnect from  '../../../../utils/dbConnect'
// dbConnect();
 

// dbConnect();

// export default async (req, res) => {
//   const {
//     query: { id },
//     method,
//   } = req;

//   switch (method) {
 
    
//     case "DELETE":
//       try {
//         const delPoster = await Poster.deleteOne({ _id: id });

//         if (!delPoster) {
//           res.status(400).json({ staus: false });
//         }
//         res.status(200).json({ status: true, data: {} });
//       } catch (error) {
//         res.status(400).json({ status: false });
//       }
//   }
// };


// pages/api/images/[id].js
const { getPool } = require("../../../../utils/db"); 

module.exports = async (req, res) => {
  const {
    query: { id },
    method,
  } = req;

  const pool = getPool();

  switch (method) {
    case "DELETE":
      try {
        if (!id) {
          return res.status(400).json({
            status: false,
            error: "id is required",
          });
        }

        // DELETE from the images table
        const deleteQuery = `
          DELETE FROM images 
          WHERE id = $1 
          RETURNING id
        `;
        const { rows } = await pool.query(deleteQuery, [id]);

        if (!rows || rows.length === 0) {
          return res.status(404).json({
            status: false,
            error: "Image not found",
          });
        }

        return res.status(200).json({
          status: true,
          data: {},
        });
      } catch (error) {
        console.error("DELETE images error:", error);
        return res
          .status(500)
          .json({ status: false, error: error.message });
      }

    default:
      res.setHeader("Allow", ["DELETE"]);
      return res
        .status(405)
        .json({
          status: false,
          error: `Method ${method} Not Allowed`,
        });
  }
};
