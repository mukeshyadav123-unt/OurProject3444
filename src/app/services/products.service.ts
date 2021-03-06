import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import * as AWS from "aws-sdk/global";
import * as S3 from "aws-sdk/clients/s3";

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  constructor(private _HttpClient: HttpClient) {}
  getFavourites(): Observable<any> {
    return this._HttpClient.get(`${environment.api}/api/favorite`, {
      responseType: "json",
    });
  }
  addToFavourites(productId: any): Observable<any> {
    return this._HttpClient.post(
      `${environment.api}/api/favorite`,
      {
        product_id: productId,
      },
      { responseType: "json" }
    );
  }
  deleteFromFavourites(productId: any): Observable<any> {
    return this._HttpClient.delete(
      `${environment.api}/api/favorite/${productId}`,
      {
        responseType: "json",
      }
    );
  }

  getProducts(page: number = null, category: string = null): Observable<any> {
    let pageParameter: string = "";
    if (page) pageParameter += "?page=" + page;

    return this._HttpClient.post(
      `${environment.api}/api/product/index${pageParameter}`,
      {
        category: category || "",
      },
      {
        responseType: "json",
      }
    );
  }
  getProduct(id): Observable<any> {
    return this._HttpClient.get(`${environment.api}/api/product/${id}`, {
      responseType: "json",
    });
  }
  addProduct(product: any): Observable<any> {
    return this._HttpClient.post(
      `${environment.api}/api/product`,
      {
        name: product.name,
        description: product.description,
        cost: product.cost,
        image_url: [product.image],
        category_id: product.category_id,
        in_stock: product.quantity,
      },
      { responseType: "json" }
    );
  }
  deleteProduct(product_id: any): Observable<any> {
    return this._HttpClient.delete(
      `${environment.api}/api/product/${product_id}`,
      {
        responseType: "json",
      }
    );
  }
  public uploadImage(file, user): Promise<any> {
    return new Promise((resolve, reject) => {
      const bucket = new S3({
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey,
        region: environment.region,
      });

      const params = {
        Bucket: "zeal-io",
        Key: Date.now() + "",
        Body: file,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
        ACL: "public-read",
      };
      bucket.upload(params, function (err, data) {
        if (err) {
          alert(err);
          console.log("There was an error uploading your file: ", err);
          reject(err);
        } else resolve(data.Location);
      });
    });
    //for upload progress
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
            console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
        }).send(function (err, data) {
            if (err) {
                console.log('There was an error uploading your file: ', err);
                return false;
            }
            console.log('Successfully uploaded file.', data);
            return true;
        });*/
  }
}
