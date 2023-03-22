export const apiHandlerWrapper = async <T> (
  callback: () => Promise<T>
): Promise<T> => {
  try {
    return await callback()
  } catch (error: any) {
    const { response } = error
    const errorMessage = response?.data?.message || 'Something went wrong'
    throw new Error(errorMessage)
  }
}
