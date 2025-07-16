import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Crown, Droplets } from "lucide-react";

interface WatermarkChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadWithWatermark: () => void;
  onOpenPricing: () => void;
  downloadType: "PDF" | "Image";
}

export const WatermarkChoiceModal = ({
  isOpen,
  onClose,
  onDownloadWithWatermark,
  onOpenPricing,
  downloadType,
}: WatermarkChoiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800">
            Choose Download Option
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Message */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              Would you like to continue downloading your resume{" "}
              {downloadType.toLowerCase()} with a watermark, or upgrade for a
              clean, professional version?
            </p>
          </div>

          {/* Download Options */}
          <div className="space-y-3">
            {/* With Watermark Option */}
            <Button
              onClick={onDownloadWithWatermark}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Droplets className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Continue with Watermark</div>
                    <div className="text-xs text-blue-100">
                      Free • Download now
                    </div>
                  </div>
                </div>
                <div className="text-lg font-bold">FREE</div>
              </div>
            </Button>

            {/* Without Watermark Option */}
            <Button
              onClick={onOpenPricing}
              variant="outline"
              className="w-full border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 text-gray-800 py-6 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 mr-3 text-yellow-600" />
                  <div className="text-left">
                    <div className="font-semibold text-gray-800">
                      Remove Watermark
                    </div>
                    <div className="text-xs text-gray-600">
                      Professional quality
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-yellow-700 bg-yellow-200 px-3 py-1 rounded-full border border-yellow-400">
                    ₹1
                  </div>
                  <div className="text-xs font-medium text-yellow-700 mt-1">
                    UPGRADE
                  </div>
                </div>
              </div>
            </Button>
          </div>

          {/* Benefits List */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              ✨ Premium Benefits:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Watermark-free downloads</li>
              <li>• High-quality PDF & images</li>
              <li>• Unlimited downloads</li>
              <li>• Professional presentation</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
