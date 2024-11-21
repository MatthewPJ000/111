import React from 'react';
import {
  Panel,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 2048;
const imageHeight = 1536;

const DownloadButton: React.FC = () => {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      1, // This is the zoom level
      2,   // This is the scale factor
      10   // This is the padding (example value, adjust as needed)
    );
  
    toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
      backgroundColor: '#dddddd',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <Panel position="top-right">
      <button
        className="bg-blue-500 text-white h-12 w-40 mr-10 rounded shadow-md hover:bg-blue-600"
        onClick={onClick}
      >
        Download Image
      </button>
    </Panel>
  );
}

export default DownloadButton;