class CustomError extends Error {
    code: string;
    actionText?: string;
    customAction?: () => void;
  
    constructor(code: string, message: string, actionText?: string, customAction?: () => void) {
      super(message);
      this.code = code;
      this.actionText = actionText;
      this.customAction = customAction;
      this.name = 'CustomError';
    }
  }
  
  export default CustomError;