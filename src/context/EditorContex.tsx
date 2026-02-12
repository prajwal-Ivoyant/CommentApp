import React, { createContext, useContext, useMemo, useState } from "react";
import type { CommentType } from "../data/commentsData";
import { commentsData } from "../data/commentsData";
import { v4 as uuidv4 } from "uuid";

type CommentsById = Record<string, CommentType>;
type ChildrenByParentId = Record<string, string[]>;

type EditorContextType = {
    commentsById: CommentsById;
    childrenByParentId: ChildrenByParentId;
    rootIds: string[];

    addComment: (text: string, user: string) => void;
    addReply: (parentId: string, text: string, user: string) => void;

    editComment: (id: string, newText: string) => void;
    deleteComment: (id: string) => void;
};

const EditorContext = createContext<EditorContextType | null>(null);

const ROOT_KEY = "root";

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const initial = useMemo(() => {
        const byId: CommentsById = {};
        const childrenMap: ChildrenByParentId = { [ROOT_KEY]: [] };

        commentsData.forEach((c) => {
            byId[c.id] = c;

            const key = c.parentId === null ? ROOT_KEY : c.parentId;

            if (!childrenMap[key]) childrenMap[key] = [];
            childrenMap[key].push(c.id);
        });

        return { byId, childrenMap };
    }, []);

    const [commentsById, setCommentsById] = useState<CommentsById>(initial.byId);
    const [childrenByParentId, setChildrenByParentId] =
        useState<ChildrenByParentId>(initial.childrenMap);

    const rootIds = childrenByParentId[ROOT_KEY] || [];

    const addComment = (text: string, user: string) => {
        const id = uuidv4();

        const newComment: CommentType = {
            id,
            parentId: null,
            user,
            text,
            createdAt: new Date().toLocaleString(),
            likes: 0,
        };

        setCommentsById((prev) => ({ ...prev, [id]: newComment }));

        setChildrenByParentId((prev) => ({
            ...prev,
            [ROOT_KEY]: [id, ...(prev[ROOT_KEY] || [])],
        }));
    };

    const addReply = (parentId: string, text: string, user: string) => {
        const id = uuidv4();

        const newReply: CommentType = {
            id,
            parentId,
            user,
            text,
            createdAt: new Date().toLocaleString(),
            likes: 0,
        };

        setCommentsById((prev) => ({ ...prev, [id]: newReply }));

        setChildrenByParentId((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), id],
        }));
    };

    const editComment = (id: string, newText: string) => {
        setCommentsById((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                text: newText,
            },
        }));
    };

    // ✅ Delete comment + delete all children recursively
    const deleteComment = (id: string) => {
        const idsToDelete: string[] = [];

        const collectAllChildren = (commentId: string) => {
            idsToDelete.push(commentId);

            const children = childrenByParentId[commentId] || [];
            children.forEach((childId) => collectAllChildren(childId));
        };

        collectAllChildren(id);

        // Remove from commentsById
        setCommentsById((prev) => {
            const updated = { ...prev };
            idsToDelete.forEach((deleteId) => delete updated[deleteId]);
            return updated;
        });

        // Remove from childrenByParentId
        setChildrenByParentId((prev) => {
            const updated = { ...prev };

            // 1) remove children list for deleted nodes
            idsToDelete.forEach((deleteId) => delete updated[deleteId]);

            // 2) remove deleted id from any parent's children list
            Object.keys(updated).forEach((key) => {
                updated[key] = updated[key].filter((cid) => !idsToDelete.includes(cid));
            });

            return updated;
        });
    };

    return (
        <EditorContext.Provider
            value={{
                commentsById,
                childrenByParentId,
                rootIds,
                addComment,
                addReply,
                editComment,
                deleteComment,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export const useEditor = () => {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
    return ctx;
};
