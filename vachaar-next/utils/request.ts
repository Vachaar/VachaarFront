import toast from "react-hot-toast";

export const makeRequest = (
  endpoint: string,
  options: { method: string; body?: Object; formData?: FormData },
  next: {
    onSuccess: (value: Response) => void;
    onError: (value: Response) => void;
    finally?: () => void;
  }
) => {
  return fetch(`/vachaar-api/${endpoint}`, {
    method: options.method,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body
      ? JSON.stringify(options.body)
      : (options.formData ?? undefined),
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
        next.onError(res);
      }
    })
    .catch(() =>
      toast.error("خطا در ارتباط با سرور. لطفا اینترنت خود را بررسی کنید.")
    )
    .finally(next.finally);
};
