import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Zap, Gift } from "lucide-react";

interface FreeDownloadExhaustedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const FreeDownloadExhaustedModal = ({
  isOpen,
  onClose,
  onOpenPricing,
}: FreeDownloadExhaustedModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <DialogTitle className="text-xl">You used your free download!</DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-600">
            Congratulations! You've successfully used your <strong>1 free download without watermark</strong>. 
            To continue downloading professional, watermark-free resumes, please upgrade to premium.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          {/* Free vs Premium Comparison */}
          <div className="grid grid-cols-1 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">What you got for free:</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 1 premium download without watermark</li>
                <li>• High-quality PDF format</li>
                <li>• Professional presentation</li>
              </ul>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-900">Upgrade to Premium:</span>
              </div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Unlimited watermark-free downloads</li>
                <li>• Multiple format options (PDF, Images)</li>
                <li>• Priority support</li>
                <li>• Starting from just ₹1</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={onOpenPricing}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full py-3"
            >
              Continue Building Resume
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
