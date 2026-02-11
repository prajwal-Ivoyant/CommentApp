import { useState } from "react";
import { Button, Card, Input, Space, Typography } from "antd";
import { useEditor } from "../context/EditorContex";
import CommentNode from "./CommentNode";

import "./commentSection.css";

const { Title } = Typography;
const { TextArea } = Input;

const CommentsSection = () => {
    const { comments, addComment } = useEditor();

    const [userName, setUserName] = useState("");
    const [commentText, setCommentText] = useState("");

    const mainComments = comments.filter((c) => c.parentId === null);

    const handleAddComment = () => {
        if (!userName.trim()) return;
        if (!commentText.trim()) return;

        addComment(commentText, userName);

        setUserName("");
        setCommentText("");
    };

    return (
        <div className="commentsSection">
            <Title level={3}>Try Commenting..</Title>

            <Card className="commentInputCard">
                <Space direction="vertical" className="commentInputBox">
                    <Input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                    />

                    <TextArea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                    />

                    <Button type="primary" onClick={handleAddComment}>
                        Post Comment
                    </Button>
                </Space>
            </Card>

            <div className="commentsList">
                {mainComments.map((comment) => (
                    <CommentNode key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
