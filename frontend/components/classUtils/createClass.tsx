"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClass } from "@/lib/teacherSettings";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function CreateClassCard({ teacherId }: { teacherId: string }) {
  const { toast } = useToast();
  const [newClass, setNewClass] = useState({
    className: "",
    semesterStart: "",
    semesterEnd: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [createdClassId, setCreatedClassId] = useState<string | null>(null);

  const handleNewClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { className, semesterStart, semesterEnd } = newClass;

      const createdClass = await createClass(
        className,
        teacherId,
        new Date(semesterStart),
        new Date(semesterEnd),
      );

      setNewClass({ className: "", semesterStart: "", semesterEnd: "" });
      setCreatedClassId(createdClass.classId);
      toast({
        description:
          "Class " + createdClass.className + " created successfully",
      });
    } catch (error) {
      console.error("Error creating class:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem creating a class.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-[#ff6b6b]">
        Create a New Class
      </h2>
      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleNewClassSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="className">Class Name</Label>
                <Input
                  id="className"
                  value={newClass.className}
                  onChange={(e) =>
                    setNewClass({ ...newClass, className: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="semesterStart">Semester Start</Label>
                  <Input
                    id="semesterStart"
                    type="date"
                    value={newClass.semesterStart}
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        semesterStart: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="semesterEnd">Semester End</Label>
                  <Input
                    id="semesterEnd"
                    type="date"
                    value={newClass.semesterEnd}
                    onChange={(e) =>
                      setNewClass({ ...newClass, semesterEnd: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="justify-self-end"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Class"}
              </Button>
            </div>
          </form>
          {createdClassId && (
            <div className="mt-4">
              <Label>Class Code:</Label>
              <div className="font-bold text-lg">{createdClassId}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { createClass } from "@/lib/teacherSettings";
// import { useToast } from "@/components/ui/use-toast";
// import { ToastAction } from "@/components/ui/toast";

// export default function CreateClassCard({ teacherId }: { teacherId: string }) {
//   const { toast } = useToast();
//   const [newClass, setNewClass] = useState({
//     className: "",
//     semesterStart: "",
//     semesterEnd: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   const handleNewClassSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const { className, semesterStart, semesterEnd } = newClass;

//       const createdClass = await createClass(
//         className,
//         teacherId,
//         new Date(semesterStart),
//         new Date(semesterEnd),
//       );

//       setNewClass({ className: "", semesterStart: "", semesterEnd: "" });
//       toast({
//         description:
//           "Class " + createdClass.className + " created successfully",
//       });
//     } catch (error) {
//       // console.error("Error creating class:", error);
//       toast({
//         variant: "destructive",
//         title: "Uh oh! Something went wrong.",
//         description: "There was a problem creating a class.",
//         action: <ToastAction altText="Try again">Try again</ToastAction>,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-[#ff6b6b]">
//         Create a New Class
//       </h2>
//       <Card className="bg-white rounded-lg shadow-md">
//         <CardContent className="p-6">
//           <form onSubmit={handleNewClassSubmit}>
//             <div className="grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="className">Class Name</Label>
//                 <Input
//                   id="className"
//                   value={newClass.className}
//                   onChange={(e) =>
//                     setNewClass({ ...newClass, className: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="grid gap-2">
//                   <Label htmlFor="semesterStart">Semester Start</Label>
//                   <Input
//                     id="semesterStart"
//                     type="date"
//                     value={newClass.semesterStart}
//                     onChange={(e) =>
//                       setNewClass({
//                         ...newClass,
//                         semesterStart: e.target.value,
//                       })
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="grid gap-2">
//                   <Label htmlFor="semesterEnd">Semester End</Label>
//                   <Input
//                     id="semesterEnd"
//                     type="date"
//                     value={newClass.semesterEnd}
//                     onChange={(e) =>
//                       setNewClass({ ...newClass, semesterEnd: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>
//               <Button
//                 type="submit"
//                 className="justify-self-end"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Creating..." : "Create Class"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
