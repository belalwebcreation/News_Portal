import { memo, useCallback } from "react";
import NewsCard from "./NewsCard";

const RightColumnItem = memo(({ 
  news, 
  index, 
  totalCount, 
  onEdit, 
  onDelete, 
  onToggle, 
  onMoveUp, 
  onMoveDown 
}) => {
  const handleEdit = useCallback(() => onEdit(news.id), [onEdit, news.id]);
  const handleDelete = useCallback(() => onDelete(news.id), [onDelete, news.id]);
  const handleToggle = useCallback(() => onToggle(news.id), [onToggle, news.id]);
  const handleMoveUp = useCallback(() => onMoveUp(index), [onMoveUp, index]);
  const handleMoveDown = useCallback(() => onMoveDown(index), [onMoveDown, index]);

  return (
    <NewsCard
      news={news}
      index={index}
      totalCount={totalCount}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleVisibility={handleToggle}
      onMoveUp={onMoveUp ? handleMoveUp : null}
      onMoveDown={onMoveDown ? handleMoveDown : null}
    />
  );
});

RightColumnItem.displayName = "RightColumnItem";

export default RightColumnItem;