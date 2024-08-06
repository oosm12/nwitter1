import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed in:", user);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        console.log("No user signed in");
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    console.log("Refreshing user:", user);
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "initializing..."
      )}
    </>
  );
}

export default App;
