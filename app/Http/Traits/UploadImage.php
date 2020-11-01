<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Str;

trait UploadImage
{
    /**
     * Allowed File Extentions array
     *
     * @var array
     */
    protected $allowedFileExtentions = [
        'png',
        'jpg',
        'jpeg',
        'gif',
    ];

    public function uploadData($file, $bucket, $folder, $type)
    {
        abort_if(! $this->isAllowedFile($type), 400, 'Not allowed image type');

        $name = Str::random(32) . '.png';// . $file->getClientOriginalExtension();
        Storage::disk('s3')->put(
            $this->buildFilePath($name, $folder),
            $file
        );

        if ($this->isImageExists($name, $folder)) {
            return $this->buildAbsoluteFilePath($name, $bucket, $folder);
        }
    }

    public function uploadImage($file, $bucket, $folder)
    {
        abort_if(! $this->isAllowedFile($file->getClientOriginalExtension()), 400, 'Not allowed image type');

        $name = Str::random(32) . '.' . $file->getClientOriginalExtension();
        Storage::disk('s3')->put(
            $this->buildFilePath($name, $folder),
            file_get_contents($file->getRealPath())
        );

        if ($this->isImageExists($name, $folder)) {
            return $this->buildAbsoluteFilePath($name, $bucket, $folder);
        }
    }

    protected function isAllowedFile($fileType): bool
    {
        return in_array(
            $fileType,
            $this->allowedFileExtentions
        );
    }

    /**
     * Return S3 bucket file path
     *
     * @param string $name
     *
     * @return string
     */
    protected function buildFilePath($name, $folder)
    {
        return $folder . '/' . $name;
    }

    /**
     * Check if the file Exists in the S3 bucket
     *
     * @param  string $name
     *
     * @return bool
     */
    protected function isImageExists($name, $folder): bool
    {
        return Storage::disk('s3')
            ->exists($this->buildFilePath($name, $folder));
    }

    /**
     * Build and return the abusolute image path
     *
     * @param  string $name
     *
     * @return string Url Of Uploaded Image
     */
    protected function buildAbsoluteFilePath($name, $bucket, $folder)
    {
        // change this to be the zeal-io s3 url
        return "https://zeal-io.s3.eu-west-2.amazonaws.com{$bucket}/{$this->buildFilePath($name, $folder)}";
    }
}
