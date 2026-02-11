import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Input,
  Space,
  Typography,
} from "antd";
import { LikeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";
import type { CommentType } from "../data/commentsData";
import { useEditor } from "../context/EditorContex";

import "./CommentNode.css";

const { Text } = Typography;
const { TextArea } = Input;

type Props = {
  comment: CommentType;
  level?: number;
};

const CommentNode: React.FC<Props> = ({ comment, level = 0 }) => {
  const { addReply, getReplies } = useEditor();

  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isExpand, setIsExpand] = useState(false);

  const replies = getReplies(comment.id);

  const handleReply = () => {
    if (!userName.trim()) return;
    if (!replyText.trim()) return;

    addReply(comment.id, replyText, userName);

    setReplyText("");
    setUserName("");
    setIsOpen(false);
  };

  const handleShowRely = () => {
    setIsOpen((prev) => !prev);
    setIsExpand(true);
  };

  return (
    <div
      className="commentNode"
      style={{ marginLeft: level * 28 }}
    >
      <Card className="commentCard">
        <Flex gap={12} align="flex-start">
          <Avatar icon={<UserOutlined />} />

          <div className="commentContent">
            <Flex justify="space-between" align="center">
              <Text strong>{comment.user}</Text>
              <Text type="secondary" className="commentTime">
                {comment.createdAt}
              </Text>
            </Flex>

            <Text className="commentText">{comment.text}</Text>

            <Space className="commentActions">
              <Button type="text" icon={<LikeOutlined />}>
                {comment.likes}
              </Button>

              <Button type="text" icon={<MessageOutlined />} onClick={handleShowRely}>
                Reply
              </Button>

              {replies.length > 0 && (
                <Button type="text" onClick={() => setIsExpand(!isExpand)}>
                  {isExpand ? <>Close</> : <>View</>} replies
                </Button>
              )}
            </Space>

            {isOpen && (
              <>
                <Divider className="commentDivider" />

                <Space direction="vertical" className="replyBox" size={10}>
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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

                    <Button onClick={() => setIsOpen(false)}>Close</Button>
                  </Space>
                </Space>
              </>
            )}
          </div>
        </Flex>
      </Card>

      {/* recursive call */}
      {isExpand && (
        <>
          {replies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} level={level + 1} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentNode;
