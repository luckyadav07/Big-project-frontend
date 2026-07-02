import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { getInitials } from "../../utils/formatters.js";
import Card from "../../components/common/Card.jsx";
import Input from "../../components/common/Input.jsx";
import Button from "../../components/common/Button.jsx";
import useUIStore from "../../store/uiStore.js";
import { uploadResume } from "../../services/resumeService.js";

function ProfilePage() {
  const { user } = useAuth();
  const showToast = useUIStore((s) => s.showToast);
  const [skills, setSkills] = useState(["React", "JavaScript", "CSS"]);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Profile updated successfully!", "success");
    }, 1000);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleResumeUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
  showToast("Please upload a PDF file.", "error");
  return;
}
  if (file.size > 5 * 1024 * 1024) {
  showToast("Resume must be smaller than 5 MB.", "error");
  return;
}

  const formData = new FormData();
  formData.append("resume", file);

  try {
    setUploading(true);
    setResumeData(null);

    const data = await uploadResume(formData);

    setResume(file);
    setResumeData(data);

    showToast("Resume uploaded successfully!", "success");
  } catch (err) {
    console.error(err);
    showToast("Resume upload failed", "error");
  } finally {
    setUploading(false);
  }
};

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="mx-auto h-28 w-28 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-3xl font-bold text-accent mb-4">
            {getInitials(user?.name)}
          </div>
          <h2 className="text-xl font-bold text-white">{user?.name}</h2>
          <p className="text-gray-400 text-sm mt-1">Software Engineer</p>
          <div className="mt-4">
            <p className="text-xs text-gray-400 mb-1">Profile Completion</p>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[95%] accent-gradient rounded-full" />
            </div>
            <p className="text-sm text-accent mt-1 font-semibold">95%</p>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-semibold text-white mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" defaultValue={user?.name} />
              <Input label="Email" type="email" defaultValue={user?.email} disabled />
              <Input label="Phone" placeholder="+91 98765 43210" />
              <Input label="Location" placeholder="Bangalore, India" />
            </div>
            <Button className="mt-4" size="sm" loading={saving} onClick={handleSave}>Save</Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Professional Info</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Current Role" defaultValue="Software Engineer" />
              <Input label="Years of Experience" defaultValue="2" />
              <Input label="Industry" defaultValue="Technology" />
            </div>
            <Button className="mt-4" size="sm" onClick={handleSave}>Save</Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Skills</h3>
            <div className="flex gap-2 mb-3">
              <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} placeholder="Add skill..." className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent" />
              <Button size="sm" variant="outline" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 rounded-lg bg-accent/20 px-3 py-1 text-sm text-accent">
                  {s}
                  <button onClick={() => setSkills(skills.filter((sk) => sk !== s))} className="text-accent/60 hover:text-accent">&times;</button>
                </span>
              ))}
            </div>
            <Button className="mt-4" size="sm" onClick={handleSave}>Save</Button>
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Resume</h3>

            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="mb-4 block w-full text-sm text-gray-300
                        file:mr-4 file:rounded-lg file:border-0
                        file:bg-accent file:px-4 file:py-2
                        file:text-white hover:file:bg-accent/80"
            />
            {resume && (
              <p className="text-green-400 text-sm mb-4">
                Uploaded: {resume.name}
              </p>
            )}

            {uploading && (
              <p className="text-yellow-400">
                Uploading...
              </p>
            )}

            {resumeData?.analysis && (
            <div className="space-y-5">

              <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-6">

                <h2 className="text-2xl font-bold text-white mb-2">
                  Resume Analysis
                </h2>

                <p className="text-green-400 font-medium mb-6">
                  ✓ Analysis completed successfully
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

                  <div>
                    <p className="text-sm text-gray-400">Skills</p>
                    <p className="text-2xl font-bold text-white">
                      {resumeData.analysis.skills?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Projects</p>
                    <p className="text-2xl font-bold text-white">
                      {resumeData.analysis.projects}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Experience</p>
                    <p className="text-2xl font-bold text-white">
                      {resumeData.analysis.experience}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Education</p>
                    <p className="text-2xl font-bold text-white">
                      {resumeData.analysis.education?.length || 0}
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid lg:grid-cols-2 gap-6">

                <div className="rounded-xl bg-white/5 p-6">
                  <h3 className="font-semibold text-white mb-3">
                    Personal Details
                  </h3>

                  <p className="text-gray-300">
                    <strong>Name:</strong> {resumeData.analysis.name}
                  </p>

                  <p className="text-gray-300">
                    <strong>Email:</strong> {resumeData.analysis.email}
                  </p>

                  <p className="text-gray-300">
                    <strong>Phone:</strong> {resumeData.analysis.phone}
                  </p>
                </div>

                <div className="rounded-xl bg-white/5 p-6">

                  <h3 className="font-semibold text-white mb-3">
                    Resume Summary
                  </h3>

                  <p className="text-gray-300">
                    Projects : {resumeData.analysis.projects}
                  </p>

                  <p className="text-gray-300">
                    Experience : {resumeData.analysis.experience}
                  </p>

                  <p className="text-gray-300">
                    Education :
                  </p>

                  <ul className="list-disc list-inside text-gray-300">

                    {resumeData.analysis.education?.map((edu) => (
                      <li key={edu}>{edu}</li>
                    ))}

                  </ul>

                </div>

              </div>

                <div className="grid md:grid-cols-2 gap-4">

                  {/* Strengths */}

                  <div className="rounded-xl bg-white/5 p-6">

                    <h3 className="font-semibold text-white mb-3">
                      Resume Strengths
                    </h3>

                    <ul className="space-y-2 text-gray-300 leading-7">

                      <li>✅ Contact information detected</li>

                      <li>✅ Technical skills are clearly listed</li>

                      <li>✅ Projects section included</li>

                      <li>✅ Education section found</li>

                      {resumeData.analysis.experience > 0 && (
                        <li>✅ Experience section available</li>
                      )}

                    </ul>

                  </div>

                  {/* AI Suggestions */}

                  <div className="rounded-xl bg-white/5 p-6">

                    <h3 className="font-semibold text-white mb-3">
                      AI Suggestions
                    </h3>

                    <ul className="space-y-2 text-gray-300">

                      <li>• Add a professional summary at the top.</li>

                      <li>• Quantify project achievements with numbers.</li>

                      <li>• Tailor your resume for each job application.</li>

                      <li>• Include GitHub and LinkedIn profile links.</li>

                      <li>• Mention certifications if you have any.</li>

                      {resumeData.analysis.missingSkills?.length > 0 && (
                        <li>
                          • Consider learning{" "}
                          <strong className="text-red-300">
                            {resumeData.analysis.missingSkills.slice(0, 3).join(", ")}
                          </strong>.
                        </li>
                      )}

                    </ul>

                  </div>

                </div>
              </div>

          )}
          </Card>

          <Card>
            <h3 className="font-semibold text-white mb-4">Social Links</h3>
            <div className="space-y-3">
              <Input label="LinkedIn" placeholder="https://linkedin.com/in/..." />
              <Input label="GitHub" placeholder="https://github.com/..." />
              <Input label="Portfolio" placeholder="https://..." />
            </div>
            <Button className="mt-4" size="sm" onClick={handleSave}>Save</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
