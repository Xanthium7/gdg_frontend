import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

export default function WelcomeHeader() {
  return (
    <Card className="mb-4 sm:mb-6 teal-gradient text-white border-none shadow-xl rounded-3xl overflow-hidden">
      <CardContent className="p-4 sm:p-6 relative">
        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-teal-light/10 rounded-full -mt-12 -mr-12 sm:-mt-16 sm:-mr-16"></div>
        <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-teal-light/10 rounded-full -mb-10 -ml-10 sm:-mb-12 sm:-ml-12"></div>

        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <div className="rounded-full bg-white/20 p-3 sm:p-4 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">GovHelper</h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl mt-1">
              Your friendly guide to government services
            </p>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 bg-white/10 p-2 sm:p-3 rounded-xl flex items-center gap-2 sm:gap-3">
          <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
          <p className="text-sm sm:text-base">
            Ask me about documents, applications, benefits, or any government service you need help with.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

