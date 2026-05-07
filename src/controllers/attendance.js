const Attendance = require("../models/attendance");
const user = require("../models/users");

exports.markAttendance = async (req, res) => {
 


  const{student_id,
        session_id,
        status}=req.body;

          const user=await user.findById(student_id);

          if(user?.role!=='student'){
            return res.status(403).json({message:'Forbidden'});

          }


  const attendance = await Attendance.create({
    session_id: session_id,
    student_id: student_id,
    status: status,
  });

  res.json(attendance);
};