const App= require("./models/application");
exports.applytothejob=async(req,res)=>{try
    {
const {jobid} = req.params;
const {userId} = req.user._id;
const cv = req.file?.filename;
if (!cv) {
  return res.status(400).json({ error: "CV file is required (PDF)." });
}
const application = new Application({
  job: jobId,
 user: userId,
  cv,

});
   await application.save();
res.status(201).json({ message: "Application submitted successfully hope the best for you." });

}
 catch (err) {
  console.error(err);
  res.status(500).json({ error: "Server error." });
}
}

exports.gettheapply=async(req,res)=>{
  try {
    const id=req.user._id;
    const applications = await Application.find({ user: id }).populate("job", "title description of company")
    ;
    res.json(applications);
 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
}

exports.getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applications = await Application.find({ job: jobId }).populate("user", "name email");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
}

const path = require("path");

exports.downloadCV = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "..", "uploads", filename);

    res.download(filePath);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "File not found." });
  }
};





