import { useState, useEffect } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status);
    }

    var timer = setTimeout(() => {
      if (friendID === 1) {
        handleStatusChange(true);
      } else {
        handleStatusChange(false);
      }
    }, 3000);
    return () => {
      clearTimeout(timer);
      console.log("清除！");
    };
  });

  return isOnline;
}

export default useFriendStatus;
