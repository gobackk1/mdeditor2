import firebase from 'firebase'

export function deleteAtPath(path: string): Promise<void> {
  return firebase.app().functions('asia-northeast1')
    .httpsCallable("recursiveDelete")({ path })
    .then(result => {
      console.log("Delete success: " + JSON.stringify(result));
    })
    .catch(err => {
      console.log("Delete failed, see console,");
      console.warn(err);
    });
}
