import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

function ExplanationBox() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full w-12 h-12 shadow-lg"
        size="icon"
      >
        <Info className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-5 right-5 z-50 w-80 shadow-lg border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>ROI Metrics Explained</span>
          </CardTitle>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="icon"
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-semibold text-blue-700">Cap Rate:</p>
          <p className="text-gray-600">Return based on property income vs price. Higher is better.</p>
        </div>
        <div>
          <p className="font-semibold text-green-700">Cash-on-Cash:</p>
          <p className="text-gray-600">How much cash you earn vs cash you invested. Target: 8%+</p>
        </div>
        <div>
          <p className="font-semibold text-purple-700">DSCR:</p>
          <p className="text-gray-600">Debt coverage ratio. &gt;1.2 = good coverage, &lt;1.0 = risky</p>
        </div>
        <div>
          <p className="font-semibold text-orange-700">NOI:</p>
          <p className="text-gray-600">Net income after expenses but before debt payments.</p>
        </div>
        <div>
          <p className="font-semibold text-red-700">Terminal Value:</p>
          <p className="text-gray-600">Projected property value after hold period (3% appreciation).</p>
        </div>
        <div>
          <p className="font-semibold text-indigo-700">IRR:</p>
          <p className="text-gray-600">Internal Rate of Return - annualized return on investment.</p>
        </div>
        <div>
          <p className="font-semibold text-teal-700">NPV:</p>
          <p className="text-gray-600">Net Present Value - current value of future cash flows.</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExplanationBox;
