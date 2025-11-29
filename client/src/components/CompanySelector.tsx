import React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Company } from "@/lib/mockData";

interface CompanySelectorProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelect: (company: Company) => void;
}

export function CompanySelector({ companies, selectedCompany, onSelect }: CompanySelectorProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between bg-background/50 border-border hover:bg-accent/50 hover:text-accent-foreground transition-all h-12 text-left font-normal"
        >
          {selectedCompany ? (
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-bold font-mono leading-none">{selectedCompany.ticker}</span>
              <span className="text-xs text-muted-foreground leading-none">{selectedCompany.name}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select company...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-card border-border" align="start">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search ticker or name..." className="h-11 border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>
            <CommandGroup heading="Technology">
              {companies.filter(c => c.sector === "Technology").map((company) => (
                <CommandItem
                  key={company.ticker}
                  value={`${company.ticker} ${company.name}`}
                  onSelect={() => {
                    onSelect(company);
                    setOpen(false);
                  }}
                  className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCompany?.ticker === company.ticker ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold font-mono">{company.ticker}</span>
                    <span className="text-xs text-muted-foreground">{company.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Other Sectors">
              {companies.filter(c => c.sector !== "Technology").map((company) => (
                <CommandItem
                  key={company.ticker}
                  value={`${company.ticker} ${company.name}`}
                  onSelect={() => {
                    onSelect(company);
                    setOpen(false);
                  }}
                  className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCompany?.ticker === company.ticker ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-bold font-mono">{company.ticker}</span>
                    <span className="text-xs text-muted-foreground">{company.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
