import toast from "react-hot-toast";

export const makeRequest = (
  endpoint: string,
  options: {
    method: string;
  } & (
    | { body: { [key: string]: unknown }; formData?: never }
    | { body?: never; formData: FormData }
    | { body?: never; formData?: never }
  ),
  next: {
    onSuccess: (value: Response) => void;
    onError: (value: Response) => void;
    finally?: () => void;
  },
  setLoggedIn?: React.Dispatch<React.SetStateAction<string>>
) => {
  return fetch(`/vachaar-api/${endpoint}`, {
    method: options.method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : options.formData,
    credentials: "include",
  })
    .then((res) => {
      if (res.ok) {
        return next.onSuccess(res);
      } else {
        if (res.status === 429) {
          toast.error(
            "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید."
          );
          return;
        }
        if (res.status === 401) {
          toast.error("ابتدا وارد حساب کاربری خود شوید.");
          setLoggedIn?.("false");
        }
        next.onError(res);
      }
    })
    .catch(() =>
      toast.error("خطا در ارتباط با سرور. لطفا اینترنت خود را بررسی کنید.")
    )
    .finally(next.finally);
};
