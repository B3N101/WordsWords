import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getClassPeople } from "@/prisma/queries";

// Helper function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export async function PeopleBoard( { classID }: { classID: string } ) {
    const data = await getClassPeople(classID);
    if (!data){
        throw new Error("Class not found");
    };
    const students = data.students.filter((student) => student.role === "STUDENT")
    const teachers = data.students.filter((student) => student.role === "TEACHER" || student.role === "ADMIN")
    return (
        <div className="container mx-auto p-4 bg-background">          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {teachers.map((teacher, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={teacher.image ? teacher.image : ""} />
                        <AvatarFallback>{getInitials(teacher.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{teacher.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Students</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid gap-4">
                    {students.map((student, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={student.image ? student.image : ""} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-none">{student.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )
}