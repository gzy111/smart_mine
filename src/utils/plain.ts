import { ElMessage } from 'element-plus'
export function plains(message:string,type:"success" | "warning" | "error" | "info",showClose?:boolean) {
    return ()=>{
        ElMessage({
            showClose: showClose,
            message: message,
            type: type,
          })
    }
  
  }