package com.mg.E_Comm.site.Controller;

import com.mg.E_Comm.site.Servise.productservise;
import com.mg.E_Comm.site.model.Product;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/API")
@CrossOrigin
public class productcontroller {

    @Autowired
    public productservise productservise;

    @GetMapping("/Products")
    public List<Product> getproduct()
    {
        return productservise.getAllproduct();
    }

    @GetMapping("/Product/{id}")
    public ResponseEntity<Product> getbyproductbyid(@PathVariable int id)
    {
        Product product = productservise.findproduct(id);

        if(product.getId() > 0)
            return new ResponseEntity<>(product , HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/Product")
    public ResponseEntity<?> addOrupdateproduct(@RequestPart("Product") Product product , @RequestPart("imageFile") MultipartFile imageFile)
    {
//        System.out.println("Received Product: " + product);
//        System.out.println("Image File: " + imageFile.getOriginalFilename());

        Product newproduct = null;
        try {
            newproduct = productservise.addOrupdateproduct(product,imageFile);
            return new ResponseEntity<>(newproduct , HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage() , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("Product/{id}/image")
    public ResponseEntity<byte[]> getbyproductidimage (@PathVariable int id)
    {
        Product product = productservise.findproduct(id);
        return new ResponseEntity<>(product.getImageData() ,  HttpStatus.OK);
    }

    @PutMapping("Product/update/{id}")
    public ResponseEntity<String> updateproduct (@PathVariable int id , @RequestPart("Product") Product product , @RequestPart("imageFile") MultipartFile imageFile )
    {
        Product updateproduct = null;
        try {
            updateproduct = productservise.addOrupdateproduct( product , imageFile);
            return new ResponseEntity<>("Updated" , HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(e.getMessage() , HttpStatus.BAD_REQUEST);
        }
    }



    @DeleteMapping("Product/{id}")
    public ResponseEntity<String> deleteproduct(@PathVariable int id)
    {
        Product deleteproduct = productservise.findproduct(id);
        if(deleteproduct != null)
        {
            productservise.deleteproduct(id);
            return new ResponseEntity<>("deleted!!" , HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<>("Product is not available!" , HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/Products/search")
    public ResponseEntity<List<Product>> searchproduct (@RequestParam String keyword)
    {
        List<Product> products = productservise.searchproduct(keyword);
        return new ResponseEntity<>(products , HttpStatus.OK);
    }

}
