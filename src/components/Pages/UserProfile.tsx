
import { useNavigate } from "react-router-dom";
const UserProfile = () => {
const navigate = useNavigate();
  const name: string = localStorage.getItem("name") || "Guest";
  const nbkId: string = localStorage.getItem("mbkId") || "Not Set";
  const userRole: string = localStorage.getItem("role") || "Guest";

  const handleLogout = (): void => {
     if (window.confirm("Are you sure you want to logout?")) {
      // Handle logout logic here
      alert("Logged out successfully!")
    }
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>NBKID:</strong> {nbkId}</p>
    <p><strong>User Role:</strong> {userRole}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
