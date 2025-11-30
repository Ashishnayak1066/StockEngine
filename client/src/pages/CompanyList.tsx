import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { COMPANIES, Company } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpRight, ArrowDownRight, Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function CompanyList() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sort companies alphabetically by ticker
  const sortedCompanies = [...COMPANIES].sort((a, b) => a.ticker.localeCompare(b.ticker));
  
  const filteredCompanies = sortedCompanies.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Market Overview</h2>
          <p className="text-muted-foreground">
            Track performance of top companies. Select a stock for detailed analysis and AI predictions.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 bg-black p-4 rounded-xl border border-border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ticker or company name..." 
              className="pl-10 bg-black border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-black rounded-md border border-border text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </div>
        </div>

        {/* Companies List Table */}
        <div className="border border-border rounded-xl overflow-hidden bg-black">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-black text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2">Ticker</div>
            <div className="col-span-3">Company</div>
            <div className="col-span-2">Sector</div>
            <div className="col-span-2 text-right">Market Cap</div>
            <div className="col-span-2 text-right">Change (24h)</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y divide-border/50">
            {filteredCompanies.map((company) => (
              <div 
                key={company.ticker}
                onClick={() => setLocation(`/stock/${company.ticker}`)}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-900 transition-colors cursor-pointer group"
              >
                <div className="col-span-2 font-mono font-bold text-primary group-hover:text-primary/80">
                  {company.ticker}
                </div>
                <div className="col-span-3 font-medium truncate">
                  {company.name}
                </div>
                <div className="col-span-2">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10">
                    {company.sector}
                  </span>
                </div>
                <div className="col-span-2 text-right font-mono text-muted-foreground">
                  {company.market_cap}
                </div>
                <div className="col-span-2 text-right">
                  <div className={cn(
                    "inline-flex items-center font-mono font-medium",
                    company.change_percent >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {company.change_percent >= 0 ? "+" : ""}{company.change_percent}%
                    {company.change_percent >= 0 ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                  </div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
