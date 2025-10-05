const EmptyView = () => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No tasks found.</p>
      <p className="text-sm mt-1">Add a new task to get started!</p>
    </div>
  );
};

export default EmptyView;
