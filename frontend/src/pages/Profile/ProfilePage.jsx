import React, { useState, useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authService.getProfile();
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        toast.error("Failed to fetch profile data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long..");
      return;
    }
    setPasswordLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
    } catch (error) {
      toast.error("Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if(loading) {
    return <Spinner />;
  }

  return (
    <div>
      <PageHeader title="Profile Settings" />

      {/* User Information Display */}
      <div className="">
        <h3 className="">User Information</h3>
        <div className="">
          <label className="">Username</label>
          <div className="">
            <User size={16} />
            <span className="">{username}</span>
          </div>
        </div>
        <div className="">
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Email Address
          </label>
          <p className="w-full">
            <Mail className="h-4 w-4 text-neutral-400" />
            <span>{email}</span>
          </p>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Change Password</h3>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="" />
            </div>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="" />
            </div>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="" />
            </div>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="">
          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;