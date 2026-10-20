import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { ASSETS } from '../data/mockStore';
import { GangSheetElement } from '../types';
import { 
  Plus, 
  Trash2, 
  RotateCw, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  Grid
} from 'lucide-react';

export const GangSheetBuilderView: React.FC = () => {
  const { addToCart, setView } = useStore();

  const rollLengths = [
    { length: 24, label: '22" × 24" Small Roll (2 ft)', price: 19.99 },
    { length: 60, label: '22" × 60" Medium Roll (5 ft)', price: 39.99 },
    { length: 120, label: '22" × 120" Pro Roll (10 ft)', price: 74.99 },
    { length: 240, label: '22" × 240" Wholesale Roll (20 ft)', price: 139.99 },
  ];

  const [selectedLength, setSelectedLength] = useState<number>(60);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('el-1');

  // Pre-loaded high quality graphic assets for instant testing
  const sampleGraphics = [
    { name: 'Streetwear Skull Logo', url: ASSETS.heroBanner, w: 10, h: 10 },
    { name: 'Mountain Adventure Badge', url: ASSETS.gangSheetRoll, w: 5, h: 5 },
    { name: 'Gloss Botanical Tiger', url: ASSETS.uvDtfDecals, w: 8, h: 8 },
    { name: 'Neck Tag Label', url: ASSETS.blankApparel, w: 3, h: 2.5 },
  ];

  // Canvas elements state (positions in inches)
  const [elements, setElements] = useState<GangSheetElement[]>([
    {
      id: 'el-1',
      name: 'Chest Graphic',
      imageUrl: ASSETS.heroBanner,
      x: 1,
      y: 1,
      width: 10,
      height: 10,
      rotation: 0
    },
    {
      id: 'el-2',
      name: 'Left Sleeve Badge',
      imageUrl: ASSETS.gangSheetRoll,
      x: 12,
      y: 1,
      width: 4.5,
      height: 4.5,
      rotation: 0
    },
    {
      id: 'el-3',
      name: 'Right Sleeve Badge',
      imageUrl: ASSETS.uvDtfDecals,
      x: 12,
      y: 6.5,
      width: 4.5,
      height: 4.5,
      rotation: 0
    }
  ]);

  // Selected roll configuration
  const activeRoll = rollLengths.find(r => r.length === selectedLength) || rollLengths[1];
  const sheetWidth = 22; // inches
  const sheetHeight = selectedLength; // inches

  // Space utilization calculation
  const totalArea = sheetWidth * sheetHeight; // sq inches
  const usedArea = elements.reduce((acc, el) => acc + (el.width * el.height), 0);
  const utilization = Math.min(100, Math.round((usedArea / totalArea) * 100));

  // Overflow detection
  const overflowingElements = elements.filter(el => 
    el.x + el.width > sheetWidth || el.y + el.height > sheetHeight
  );

  // Dragging mechanics
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Conversion scale: 1 inch = 12 pixels base at zoom 1
  const pixelsPerInch = 12 * zoomLevel;

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedElementId(id);
    setDraggingId(id);

    const el = elements.find(item => item.id === id);
    if (!el || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseXInches = (e.clientX - rect.left) / pixelsPerInch;
    const mouseYInches = (e.clientY - rect.top) / pixelsPerInch;

    setDragOffset({
      x: mouseXInches - el.x,
      y: mouseYInches - el.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseXInches = (e.clientX - rect.left) / pixelsPerInch;
    const mouseYInches = (e.clientY - rect.top) / pixelsPerInch;

    const newX = Math.max(0, Math.round((mouseXInches - dragOffset.x) * 2) / 2);
    const newY = Math.max(0, Math.round((mouseYInches - dragOffset.y) * 2) / 2);

    setElements(prev => prev.map(item => 
      item.id === draggingId ? { ...item, x: newX, y: newY } : item
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // Add graphic to canvas
  const handleAddGraphic = (graphic: { name: string; url: string; w: number; h: number }) => {
    const id = `el-${Date.now()}`;
    // Position at next available space
    const lastElement = elements[elements.length - 1];
    const newY = lastElement ? lastElement.y + lastElement.height + 0.5 : 1;

    const newElement: GangSheetElement = {
      id,
      name: graphic.name,
      imageUrl: graphic.url,
      x: 1,
      y: Math.min(sheetHeight - graphic.h, newY),
      width: graphic.w,
      height: graphic.h,
      rotation: 0
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElementId(id);
  };

  // Upload user graphic
  const handleUploadGraphic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handleAddGraphic({
        name: file.name.replace(/\.[^/.]+$/, ""),
        url,
        w: 6,
        h: 6
      });
    }
  };

  // Element controls
  const handleRotate = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedElementId) {
        // Swap width and height when rotating 90 deg
        return {
          ...el,
          rotation: (el.rotation + 90) % 360,
          width: el.height,
          height: el.width
        };
      }
      return el;
    }));
  };

  const handleDuplicate = () => {
    if (!selectedElementId) return;
    const source = elements.find(el => el.id === selectedElementId);
    if (!source) return;

    const clone: GangSheetElement = {
      ...source,
      id: `el-${Date.now()}`,
      x: Math.min(sheetWidth - source.width, source.x + 1),
      y: Math.min(sheetHeight - source.height, source.y + 1)
    };

    setElements(prev => [...prev, clone]);
    setSelectedElementId(clone.id);
  };

  const handleDelete = () => {
    if (!selectedElementId) return;
    setElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  const handleAutoPack = () => {
    // Intelligent auto-nesting layout helper
    let currentX = 0.5;
    let currentY = 0.5;
    let rowMaxHeight = 0;

    const sorted = [...elements].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const packed = sorted.map(el => {
      if (currentX + el.width > sheetWidth) {
        // Move to next row
        currentX = 0.5;
        currentY += rowMaxHeight + 0.5;
        rowMaxHeight = el.height;
      } else {
        rowMaxHeight = Math.max(rowMaxHeight, el.height);
      }

      const placed = {
        ...el,
        x: currentX,
        y: currentY
      };

      currentX += el.width + 0.5;
      return placed;
    });

    setElements(packed);
  };

  const handleAddToCart = () => {
    addToCart({
      productId: 'prod-gang-sheet-builder',
      productName: `Custom 22" × ${selectedLength}" DTF Gang Sheet`,
      category: 'gang-sheets',
      productImage: ASSETS.gangSheetRoll,
      variantName: `22" × ${selectedLength}" Continuous Roll (${elements.length} Graphics)`,
      unitPrice: activeRoll.price,
      quantity: 1,
      gangSheetConfig: {
        sheetWidth,
        sheetLength: selectedLength,
        elements,
        totalAreaUsedPercentage: utilization,
        artfileName: `gang_sheet_22x${selectedLength}_${elements.length}_items.pdf`
      }
    });
  };

  const activeElement = elements.find(el => el.id === selectedElementId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
            Visual Gang Sheet Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            Interactive 22" Gang Sheet Builder
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Build wholesale rolls online. Drag, position, duplicate, and optimize space without expensive prepress software.
          </p>
        </div>

        {/* Roll Size Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {rollLengths.map((roll) => (
            <button
              key={roll.length}
              onClick={() => setSelectedLength(roll.length)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap shrink-0 ${
                selectedLength === roll.length
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span>{roll.length}" Roll</span>
              <span className="block font-mono text-[11px] text-neutral-400 font-normal">
                ${roll.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {overflowingElements.length > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Warning:</strong> {overflowingElements.length} design(s) exceed the 22" × {selectedLength}" roll boundary. Drag them inside the printable area.
            </span>
          </div>
          <button
            onClick={handleAutoPack}
            className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 rounded text-amber-900 font-bold text-[11px]"
          >
            Auto-Pack Sheet
          </button>
        </div>
      )}

      {/* Main Studio Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Toolbar: Assets & Graphic Library (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Upload Custom Button */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Add Your Artwork
            </h3>
            <input
              type="file"
              id="gs-file-input"
              accept="image/*"
              onChange={handleUploadGraphic}
              className="hidden"
            />
            <label
              htmlFor="gs-file-input"
              className="w-full py-2.5 px-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New File</span>
            </label>
            <p className="text-[10px] text-neutral-400 text-center">
              PNG with transparent background at 300 DPI
            </p>
          </div>

          {/* Graphic Library */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Sample Assets Library
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {sampleGraphics.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddGraphic(item)}
                  className="p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-left transition-colors flex flex-col items-center group"
                >
                  <div className="w-16 h-16 rounded overflow-hidden mb-1.5 bg-neutral-200 flex items-center justify-center">
                    <img src={item.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-800 line-clamp-1 text-center w-full">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {item.w}" × {item.h}"
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick auto nest button */}
          <button
            onClick={handleAutoPack}
            className="w-full py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl border border-neutral-300 transition-colors flex items-center justify-center gap-2"
          >
            <Grid className="w-4 h-4 text-neutral-600" />
            <span>Auto-Pack & Nest All Graphics</span>
          </button>
        </div>

        {/* Center: Interactive Canvas Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Canvas Viewport Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-mono font-bold text-neutral-700">
              <span>22" × {selectedLength}" Sheet</span>
              <span className="text-neutral-300">·</span>
              <span className="text-rose-600">{elements.length} Placed</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoomLevel(Math.max(0.6, zoomLevel - 0.2))}
                className="p-1 text-neutral-500 hover:text-neutral-900 rounded bg-neutral-100"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-semibold px-1 text-neutral-600">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(2.0, zoomLevel + 0.2))}
                className="p-1 text-neutral-500 hover:text-neutral-900 rounded bg-neutral-100"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Canvas Container */}
          <div 
            className="bg-neutral-800 rounded-2xl p-6 overflow-auto max-h-160 flex justify-center border border-neutral-700 shadow-inner select-none cursor-default"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              ref={canvasRef}
              className="relative bg-white shadow-2xl transition-all border-2 border-neutral-400"
              style={{
                width: `${sheetWidth * pixelsPerInch}px`,
                height: `${sheetHeight * pixelsPerInch}px`,
                backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
                backgroundSize: `${pixelsPerInch}px ${pixelsPerInch}px`
              }}
              onClick={() => setSelectedElementId(null)}
            >
              {/* Width & Height grid markers */}
              <div className="absolute top-1 left-2 text-[10px] font-mono text-neutral-400 pointer-events-none">
                0, 0 (22" Printable Width)
              </div>
              <div className="absolute bottom-1 right-2 text-[10px] font-mono text-neutral-400 pointer-events-none">
                22", {selectedLength}"
              </div>

              {/* Elements on canvas */}
              {elements.map((el) => {
                const isSelected = selectedElementId === el.id;
                const isOverflowing = el.x + el.width > sheetWidth || el.y + el.height > sheetHeight;

                return (
                  <div
                    key={el.id}
                    onMouseDown={(e) => handleMouseDown(e, el.id)}
                    className={`absolute cursor-move group transition-shadow ${
                      isSelected 
                        ? 'ring-2 ring-rose-500 shadow-lg z-20' 
                        : 'hover:ring-1 hover:ring-neutral-400 z-10'
                    } ${isOverflowing ? 'border-2 border-dashed border-red-600 bg-red-50/20' : ''}`}
                    style={{
                      left: `${el.x * pixelsPerInch}px`,
                      top: `${el.y * pixelsPerInch}px`,
                      width: `${el.width * pixelsPerInch}px`,
                      height: `${el.height * pixelsPerInch}px`,
                    }}
                  >
                    <img
                      src={el.imageUrl}
                      alt={el.name}
                      className="w-full h-full object-contain pointer-events-none drop-shadow-xs"
                      style={{ transform: `rotate(${el.rotation}deg)` }}
                    />

                    {/* Dimensions tag */}
                    <div className="absolute bottom-0 right-0 bg-neutral-900/80 text-white font-mono text-[9px] px-1 rounded-tl pointer-events-none">
                      {el.width}"×{el.height}"
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Toolbar: Selected Item Controls & Checkout (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Element Inspector / Actions */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Selected Item Controls
            </h3>

            {activeElement ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-neutral-800 truncate">
                  {activeElement.name}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-400 block font-sans">Width</span>
                    <span>{activeElement.width}"</span>
                  </div>
                  <div className="bg-neutral-50 p-2 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-400 block font-sans">Height</span>
                    <span>{activeElement.height}"</span>
                  </div>
                </div>

                {/* Edit Action buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 flex flex-col items-center gap-1 transition-colors"
                    title="Rotate 90 degrees"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Rotate</span>
                  </button>

                  <button
                    onClick={handleDuplicate}
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 flex flex-col items-center gap-1 transition-colors"
                    title="Duplicate graphic"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Clone</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
                    title="Delete graphic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Delete</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-neutral-400">
                Click on any design on the sheet to adjust position, size, or rotate.
              </div>
            )}
          </div>

          {/* Roll Utilization & Pricing Summary */}
          <div className="bg-neutral-900 text-white p-5 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-400 font-semibold">Sheet Utilization</span>
                <span className="font-mono font-bold text-emerald-400">{utilization}%</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${utilization > 80 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${utilization}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                {usedArea.toFixed(1)} of {totalArea} sq inches utilized
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-400">Roll Dimension:</span>
                <span className="font-mono font-semibold">22" × {selectedLength}"</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Graphics:</span>
                <span className="font-mono font-semibold">{elements.length} designs</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-neutral-800">
                <span>Roll Price:</span>
                <span className="font-mono text-lg text-rose-500">${activeRoll.price.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={elements.length === 0}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>Add Gang Sheet to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[10px] text-neutral-400 text-center flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Print Guarantee · Prepress Automated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
