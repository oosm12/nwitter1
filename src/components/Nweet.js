import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (ok) {
      // Firestore에서 nweet 삭제
      const nweetDocRef = doc(dbService, "nweets", nweetObj.id);
      await deleteDoc(nweetDocRef);

      // Storage에서 첨부 파일 삭제
      if (nweetObj.attachmentUrl !== "") {
        const fileRef = ref(storageService, nweetObj.attachmentUrl);
        await deleteObject(fileRef);
      }
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const nweetDocRef = doc(dbService, "nweets", nweetObj.id);
    await updateDoc(nweetDocRef, { text: newNweet });
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
           <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              onChange={onChange}
              value={newNweet}
              required
              placeholder="Edit your nweet"
              autoFocus
              className="formInput"
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <button onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="attachment" />
          )}
          {isOwner && (
             <div className="nweet__actions">
             <span onClick={onDeleteClick}>
               <FontAwesomeIcon icon={faTrash} />
             </span>
             <span onClick={toggleEditing}>
               <FontAwesomeIcon icon={faPencilAlt} />
             </span>
           </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
