export type CommentType = {
    id: string;
    parentId: string | null;
    user: string;
    text: string;
    createdAt: string;
    likes: number;
};

export const commentsData: CommentType[] = [
    {
        id: "1",
        parentId: null,
        user: "Prajwal",
        text: "This is my first comment 🔥",
        createdAt: "2026-02-11 10:00 AM",
        likes: 2,
    },
    {
        id: "2",
        parentId: null,
        user: "Rahul",
        text: "Nice post bro!",
        createdAt: "2026-02-11 10:05 AM",
        likes: 5,
    },
    {
        id: "3",
        parentId: "1",
        user: "Sahil",
        text: "Replying to your comment 😄",
        createdAt: "2026-02-11 10:10 AM",
        likes: 1,
    },
    {
        id: "4",
        parentId: "1",
        user: "Ananya",
        text: "Same here bro, agreed 💯",
        createdAt: "2026-02-11 10:12 AM",
        likes: 3,
    },
    {
        id: "5",
        parentId: "3",
        user: "Prajwal",
        text: "Haha thanks 😄",
        createdAt: "2026-02-11 10:15 AM",
        likes: 0,
    },
];
