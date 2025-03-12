import SidebarSkeleton from "../../components/SidebarSkeleton"

function PageSkeleton() {
    return (
       
            <div className=" skeleton h-screen bg-base-200 border-2">
              <div className="skeleton flex items-center justify-center pt-20 px-4">
                <div className="skeleton bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                  <div className="skeleton flex h-full rounded-lg overflow-hidden">
                    {/* SidebarSkeleton  */}
                    <SidebarSkeleton></SidebarSkeleton>
  

                   
                  </div>
                </div>
              </div>
            </div>
    )
}

export default PageSkeleton
