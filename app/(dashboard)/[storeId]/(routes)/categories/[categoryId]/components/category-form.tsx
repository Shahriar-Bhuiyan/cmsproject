"use client";
import * as z from "zod";
import { Billboard, Category } from "@prisma/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/ui/heading";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
});

interface CategoryFormProps {
  initalData: Category | null;
  billboards:Billboard[]
}

type CategoryFormValues = z.infer<typeof formSchema>;

export const CategoryForm: React.FC<CategoryFormProps> = ({ initalData,billboards }) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const origin = useOrigin();
  const [loading, setLoading] = useState(false);

  const title = initalData ? "Edit Category" : "Create Category";
  const description = initalData ? "Edit a Category" : "Add a new Category";
  const toastMessage = initalData ? "Category updated" : "Category created";
  const action = initalData ? "Save Changes" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initalData || {
      name: "",
      billboardId: ""
    }
  });

  const onsubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);
      if(initalData){
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data);
      }else{
        await axios.post(`/api/${params.storeId}/categories`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/categories`)
      toast.success(toastMessage);
      console.log(params);
    } catch (error) {
      toast.error("Something is wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast.success("Category Deleted successfully");
    } catch (error) {
      toast.error("Make sure you remove all Product using this category first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initalData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onsubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={false}
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

              <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                   <Select 
                   disabled={loading}
                   onValueChange={field.onChange} 
                   value={field.value}
                   defaultValue={field.value}
                   >
                   <FormControl>
                    <SelectTrigger >
                       <SelectValue 
                       defaultValue={field.value}
                       placeholder={'Select a Billboard'}
                       >

                       </SelectValue>
                    </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                    {billboards.map((billboard)=>(
                      <SelectItem key={billboard.id}
                      value={billboard.id}>
                          {billboard.lable}
                      </SelectItem>
                    ))}
                   </SelectContent>
                   </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
           {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
