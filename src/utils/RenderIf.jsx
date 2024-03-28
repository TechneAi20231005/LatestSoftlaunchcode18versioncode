const RenderIf = ({ render, children }) => {
  if (render) return <>{children}</>;
  return null;
};

export default RenderIf;
