import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Locale, useLocale } from "./locale-provider";

function LanguageDropdown({ className }: { className?: string }) {
  const { setLocale, locale } = useLocale();

  const languages: {
    code: Locale;
    name: string;
  }[] = [
    {
      code: "en",
      name: "English",
    },
    {
      code: "ko",
      name: "한국어",
    },
  ];

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="text-white border-white dark:border-white hover:bg-[#1e293b] dark:hover:bg-[#1e293b]"
          >
            <Icons.globe className="w-4 h-4 mr-2" />
            {languages.find((lang) => lang.code === locale)?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-[#020819] border-[#020819]"
        >
          {languages.map((lang) => (
            <DropdownMenuItem
              onSelect={() => setLocale(lang.code)}
              data-selected={locale === lang.code}
              className="data-[selected=true]:bg-[#1e293b] dark:data-[selected=ture]:bg-[#1e293b] text-white focus:bg-[#1e293b] focus:text-white"
            >
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default LanguageDropdown;
