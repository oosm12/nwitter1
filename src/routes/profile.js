import { authService, dbService } from "fbase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useState, useEffect } from "react";
import { updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      try {
        await updateProfile(authService.currentUser, { displayName: newDisplayName });
        console.log("Profile updated successfully");
        refreshUser();
        console.log("User refreshed", authService.currentUser);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  useEffect(() => {
    const getMyNweets = async () => {
      const q = query(
        collection(dbService, "nweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt", "asc")
      );
      const nweets = await getDocs(q);
      console.log(nweets.docs.map((doc) => doc.data()));
    };
    getMyNweets();
  }, [userObj.uid]);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
    
};

export default Profile;
