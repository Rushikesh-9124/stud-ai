"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });


  const {
    loading: updateLoading,
    fn: updateUserFn,
    data: updateResult
  } = useFetch(updateUser)

  const onSubmit = async (values) => {
    try {
        const formattedIndustry = `${values.industry}-${values.subIndustry}`.toLowerCase()
        .replace(/ /g, "-")

        await updateUserFn({
            ...values,
            industry: formattedIndustry
        })
    }catch (error) {
        console.log('Onboarding Error', error.message)
    }
  };

  useEffect(()=>{
    if(updateResult?.success && !updateLoading){
        toast.success("Profile Completed Successfully!")
        router.push('/dashboard')
        router.refresh()
    }
  }, [updateResult, updateLoading])

  const watchIndustry = watch("industry");

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className={"w-full max-w-lg mt-10 mx-2"}>
        <CardHeader>
          <CardTitle className={"gradient-title text-4xl "}>
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action=""
            className="w-full space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full space-y-3">
              <Label id='industry' htmlFor="industry">Industry</Label>
              <Select
                className="w-full"
                
                onValueChange={(value) => {
                    setValue("industry", value);
                    setSelectedIndustry(
                      industries.find((item) => item.id === value)
                    );
                    setValue("subIndustry", "");
                  }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((item, idx) => (
                    <SelectItem id='industry' value={item.id} key={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry?.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="w-full space-y-2">
                <Label id='subIndustry' htmlFor="subIndustry">Specializations</Label>
                <Select
                  className="w-full"
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a sub industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries?.map((item, idx) => (
                      <SelectItem value={item} key={idx}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry?.message}
                  </p>
                )}
              </div>
            )}

            <div className="w-full space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input id='experience' type='number' min='0' max='50' placeholder='Enter years of experience' {...register("experience")} />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience?.message}
                </p>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input id='skills'  placeholder='e.g., Python, JavaScript, C++, Java' {...register("skills")} />
              <p className="text-sm text-muted-foreground">Separate multiple skills with comma</p>
              {errors.skills && (
                <p className="text-sm text-red-500">
                  {errors.skills?.message}
                </p>
              )}
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id='bio' className={'h-32'}  placeholder='Tell us about your professional background...' {...register("bio")} />
              
              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio?.message}
                </p>
              )}
            </div>

            <Button className={'w-full'} disabled={updateLoading} type="submit">
                {updateLoading ? <> <Loader2  className="mr-2 h-4 w-4 animate-spi "/>Saving</> : 'Complete Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
