"use client"
import { Popover, PopoverTrigger,PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useStoreModal } from "@/hooks/use-store-modal";

import {  useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from "lucide-react";

import { Store } from "@prisma/client";
import { cn } from "@/lib/utils";

import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator ,CommandEmpty, CommandInput} from "@/components/ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function StoreSwitcher({
  className,
  items =[]
}: StoreSwitcherProps) {

    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();


    const [open,setOpen] = useState(false);

    const formattedItems = items.map((item)=>({
        label:item.name,
        value:item.id
    }));
   

    const currentStore = formattedItems.find((item)=> item.value === params.storeId);
   

    const onStoreSelect = (store:{value:string,label:string})=>{
          setOpen(false);
          router.push(`/${store.value}`)
    }
   
  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            size={'sm'}
            role="combobox"
            aria-expanded={open}
            aria-label="Select a Store"
            className={cn('w-[200px] justify-between',className)} 
            >
                <StoreIcon className="mr-2 h-4 w-4"/>
                {currentStore?.label}
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 "/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
                <CommandInput placeholder="Search Store..."/>
                <CommandEmpty>No Store Found</CommandEmpty>
                <CommandGroup heading='stores'>
                    {formattedItems.map((store)=>(
                        <CommandItem key={store.value}
                        onSelect={()=>onStoreSelect(store)}
                        className="text-sm"
                        >
                        <StoreIcon className="mr-2 h-4 w-4"/>
                        {store?.label}
                        <Check className={cn('ml-auto h-4 w-4',currentStore?.value === store.value ? "opacity-100":'opacity-0')}/>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
            <CommandSeparator/>
           <CommandList>

             <CommandGroup>
              <CommandItem 
              onSelect={()=>{
                setOpen(false)
                storeModal.onOpen();
              }}
              >
              <PlusCircle className="mr-2 w-4 h-4"/>
                Create new store
              </CommandItem>
             </CommandGroup>
           </CommandList>

          </Command>
        </PopoverContent>
    </Popover>
  )
}
