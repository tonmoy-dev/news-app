"use client"

import PostComments from './PostComments';
import PostForm from './PostForm';

export default function PostCommentsLayout({ postId, comments }) {


  return (
    <div className="bg-white">
      <PostForm postId={postId} />
      <PostComments comments={comments} />
    </div>
  );
};