import React, { createContext, useContext, useState } from "react";
import type { CommentType } from "../data/commentsData";
import { commentsData } from "../data/commentsData";
import { v4 as uuidv4 } from "uuid";

type EditorContextType = {
    comments: CommentType[];
    addComment: (text: string, user: string) => void;
    addReply: (parentId: string, text: string, user: string) => void;
    getReplies: (parentId: string) => CommentType[];
};

const EditorContext = createContext<EditorContextType | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [comments, setComments] = useState<CommentType[]>(commentsData);

    const addComment = (text: string, user: string) => {
        const newComment: CommentType = {
            id: uuidv4(),
            parentId: null,
            user,
            text,
            createdAt: new Date().toLocaleString(),
            likes: Math.floor(Math.random() * 10),
        };

        setComments((prev) => [newComment, ...prev]);
    };

    const addReply = (parentId: string, text: string, user: string) => {
        const newReply: CommentType = {
            id: uuidv4(),
            parentId,
            user,
            text,
            createdAt: new Date().toLocaleString(),
            likes: Math.floor(Math.random() * 10),
        };

        setComments((prev) => [...prev, newReply]);
    };

    //so every reply know who is its parent ?
    const getReplies = (parentId: string) => {
        return comments.filter((c) => c.parentId === parentId);
    };

    return (
        <EditorContext.Provider value={{ comments, addComment, addReply, getReplies }}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditor = () => {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
    return ctx;
};
