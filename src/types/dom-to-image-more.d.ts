declare module "dom-to-image-more" {
  const domToImage: {
    toPng: (
      node: Node,
      options?: {
        bgcolor?: string;
        quality?: number;
        width?: number;
        height?: number;
        style?: Record<string, string>;
      }
    ) => Promise<string>;
  };
  export default domToImage;
}
