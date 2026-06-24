import { useEffect, useState } from "react";
import { getAllJobs } from "../services/jobService";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1>All Jobs</h1>

      {jobs.map((job) => (
        <div key={job._id}>
          <h3>{job.title}</h3>
          <p>{job.company}</p>
        </div>
      ))}
    </div>
  );
};

export default Jobs;



// Jobs Page Load
//       ↓
// getAllJobs()
//       ↓
// GET /api/jobs
//       ↓
// jobs state
//       ↓
// Render
