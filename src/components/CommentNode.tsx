import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Modal,
  Space,
  Typography,
} from "antd";

import {
  DeleteOutlined,
  EditOutlined,
  LikeOutlined,
  MessageOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useEditor } from "../context/EditorContex";

import "./CommentNode.css";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  commentId: string;
  level?: number;
};

const CommentNode: React.FC<Props> = ({ commentId, level = 0 }) => {
  const { commentsById, childrenByParentId, addReply, editComment, deleteComment } =
    useEditor();

  const comment = commentsById[commentId];
  const childIds = childrenByParentId[commentId] || [];

  const [isExpand, setIsExpand] = useState(false);
  const [isOpen, setIsOpen] = useState(false)

  // reply
  const [replyUser, setReplyUser] = useState("");
  const [replyText, setReplyText] = useState("");

  // edit
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment?.text || "");

  if (!comment) return null;

  const handleReply = () => {
    if (!replyUser.trim()) return;
    if (!replyText.trim()) return;

    addReply(comment.id, replyText, replyUser);

    setReplyText("");
    setReplyUser("");
    setIsExpand(true);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    editComment(comment.id, editText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete comment?",
      content: "This will also delete all nested replies under it.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteComment(comment.id),
    });
  };

  return (
    <div style={{ marginLeft: level * 28, marginTop: 12 }}>
      <Card className="commentCard">
        <Flex gap={12} align="flex-start">
          <Avatar icon={<UserOutlined />} />

          <div className="commentBody">
            <Flex justify="space-between" align="center">
              <Text strong>{comment.user}</Text>
              <Text type="secondary" className="commentTime">
                {comment.createdAt}
              </Text>
            </Flex>

            {!isEditing ? (
              <Text className="commentText">{comment.text}</Text>
            ) : (
              <Space direction="vertical" className="editBox">
                <TextArea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                />

                <Space>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>

                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </Space>
              </Space>
            )}

            <Space className="commentActions">
              <Button type="text" icon={<LikeOutlined />}>
                {comment.likes}
              </Button>

              <Button
                type="text"
                icon={<MessageOutlined />}
                onClick={() => setIsOpen((prev) => !prev)}
              >
                Reply
              </Button>

              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setIsEditing(true);
                  setEditText(comment.text);
                }}
              >
                Edit
              </Button>

              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Delete
              </Button>

              {childIds.length > 0 && (
                <Button type="text" onClick={() => setIsExpand(!isExpand)}>
                  {isExpand ? <>Close</> : <>View</>} replies
                </Button>
              )}
            </Space>


            {isOpen && (<>

              <Divider className="replyDivider" />

              <Space direction="vertical" className="replyBox" size={10}>
                <Input
                  value={replyUser}
                  onChange={(e) => setReplyUser(e.target.value)}
                  placeholder="Your name"
                />

                <TextArea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                />

                <Space>
                  <Button type="primary" onClick={handleReply}>
                    Post Reply
                  </Button>
                  <Button onClick={() => setIsExpand(false)}>Close</Button>
                </Space>
              </Space>
            </>)}


            {isExpand && (
              <>
                {childIds.length > 0 && (
                  <div className="repliesContainer">
                    {childIds.map((childId) => (
                      <CommentNode
                        key={childId}
                        commentId={childId}
                        level={level + 1}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </Flex>
      </Card>
    </div>
  );
};

export default CommentNode;
