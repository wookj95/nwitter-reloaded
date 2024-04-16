import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

export interface ITweet {
  id: string;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: dodgerblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
`;

const TimeStamp = styled.span`
  font-size: 12px;
  color: #666;
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  createdAt,
}: ITweet) {
  const user = auth.currentUser;
  const [editing, setEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);

  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onEdit = () => {
    setEditing(true);
  };

  const onSaveEdit = async () => {
    try {
      const tweetRef = doc(db, "tweets", id);
      await updateDoc(tweetRef, {
        tweet: editedTweet,
      });
      setEditing(false);
    } catch (error) {
      console.error("Tweet modification error:", error);
    }
  };

  const onCancelEdit = () => {
    setEditing(false);
    setEditedTweet(tweet);
  };

  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {editing ? (
          <textarea
            value={editedTweet}
            onChange={(e) => setEditedTweet(e.target.value)}
          />
        ) : (
          <Payload>{tweet}</Payload>
        )}
        <TimeStamp>{formattedDate}</TimeStamp>
        <div></div>
        {user?.uid === userId && !editing && (
          <>
            <EditButton onClick={onEdit}>수정</EditButton>
            <DeleteButton onClick={onDelete}>삭제</DeleteButton>
          </>
        )}
        {editing && (
          <>
            <button onClick={onSaveEdit}>저장</button>
            <button onClick={onCancelEdit}>취소</button>
          </>
        )}
      </Column>
      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
