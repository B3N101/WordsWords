import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableRow, TableCell, TableBody, TableHeader, TableHead } from "@/components/ui/table"
export function AttemptsTableSkeleton(){
    return (
        <div className="p-6 w-full">
            <Card className="bg-white rounded-lg shadow-md">
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-40" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                                <TableCell>
                                    <Skeleton className="h-6 w-40" />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export function HeaderSkeleton(){
    return (
        <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-6 w-40" />
        </div>
    )
}

export function QuizTableSkeleton(){
    return (
        <div className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <Card className="bg-white rounded-lg shadow-md">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-40" />

                    </CardContent>
                </Card>
                <Card className="bg-white rounded-lg shadow-md">
                    <CardContent className="p-6">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-6 w-40" />

                    </CardContent>
                </Card>
            </div>
            <div className="mt-8">
            <Card className="bg-white rounded-lg shadow-md">
                <CardContent className="p-6">
                    <Skeleton className="h-6 w-40" />
                </CardContent>
            </Card>
            </div> 
        </div>
    )
}