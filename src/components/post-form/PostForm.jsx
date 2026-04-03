import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { RTE } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { isDirty } } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.$id || "",
        content: post?.content || "",
        status: post?.status || "active",
      },
    });

  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userData)
  const [submitting, setSubmitting] = useState(false)
  const [fileName, setFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [imageChanged, setImageChanged] = useState(false) // ✅ track image separately

  // Any change = isDirty (text fields) OR imageChanged (file input)
  const hasChanges = isDirty || imageChanged

  const submit = async (data) => {
    setSubmitting(true)
    try {
      if (post) {
        const file = selectedFile ? await appwriteService.uploadFile(selectedFile) : null
        if (file) appwriteService.deleteFile(post.featuredImage)
        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        })
        if (dbPost) {
          setImageChanged(false) // reset after save
          navigate(`/post/${dbPost.$id}`)
        }
      } else {
        if (!selectedFile) {
          alert('Please select a featured image before publishing.')
          setSubmitting(false)
          return
        }
        const file = await appwriteService.uploadFile(selectedFile)
        if (file) {
          data.featuredImage = file.$id
          const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })
          if (dbPost) navigate(`/post/${dbPost.$id}`)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

   const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      //same as below but with regex and also remove special characters except for hyphen

      //     const slug = value.toLowerCase.replace(/ /g , "-");
      // setValue("slug", slug);
      // return slug;
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-")
        .slice(0, 36) // limit slug to 36 characters;

    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, slugTransform, setValue])

  // Button is green when there are changes, grey when no changes
  const submitBtnBg = submitting
    ? 'var(--ink-muted)'
    : post
      ? hasChanges ? '#16a34a' : 'var(--ink-muted)'
      : 'var(--ink)'

  const labelStyle = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink-muted)',
    marginBottom: '8px',
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 16px',
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '48px', alignItems: 'start' }}>

        {/* ── Left ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              placeholder="Your post title..."
              style={{ ...inputStyle, fontSize: '1.05rem' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,81,42,0.08)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              {...register("title", { required: true })}
            />
          </div>

          <div>
            <label style={labelStyle}>Slug</label>
            <input
              placeholder="auto-generated-from-title"
              style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--ink-muted)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200,81,42,0.08)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
              {...register("slug", { required: true })}
              onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true })}
            />
          </div>

          <div>
            <label style={labelStyle}>Content</label>
            <RTE name="content" control={control} defaultValue={getValues("content")} />
          </div>
        </div>

        {/* ── Right ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '88px' }}>

          {/* Image upload */}
          <div>
            <label style={labelStyle}>Featured Image</label>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px', background: '#fff',
              border: `1px solid ${imageChanged ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: '10px', cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = imageChanged ? 'var(--accent)' : 'var(--border)'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: fileName ? 'var(--ink)' : 'var(--ink-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {fileName || 'Choose image...'}
              </span>
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSelectedFile(file)
                    setFileName(file.name)
                    setImageChanged(true) // ✅ mark as changed
                  }
                }}
              />
            </label>
            {/* Show "new image selected" indicator */}
            {imageChanged && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: '#16a34a', marginTop: '6px', letterSpacing: '0.08em',
              }}>✓ New image selected</p>
            )}
          </div>

          {/* Current image preview */}
          {post && (
            <div>
              <label style={labelStyle}>{imageChanged ? 'Current Image (will be replaced)' : 'Current Image'}</label>
              <div style={{
                borderRadius: '10px', overflow: 'hidden',
                border: `1px solid ${imageChanged ? '#fca5a5' : 'var(--border)'}`,
                opacity: imageChanged ? 0.5 : 1,
                transition: 'opacity 0.3s ease, border-color 0.3s ease',
              }}>
                <img
                  src={appwriteService.getFilePreview(post.featuredImage)}
                  alt={post.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              {...register("status", { required: true })}
            >
              <option value="active">Active — visible to all</option>
              <option value="inactive">Draft — hidden</option>
            </select>
          </div>

          {/* Submit */}
          <div>
            {post && (
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                color: hasChanges ? '#16a34a' : 'var(--ink-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: '8px', transition: 'color 0.3s ease',
              }}>
                {hasChanges ? '● Unsaved changes' : '○ No changes'}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting || (post && !hasChanges)}
              style={{
                width: '100%', padding: '13px 24px',
                borderRadius: '100px', border: 'none',
                fontFamily: 'var(--font-body)', fontSize: '0.9rem',
                fontWeight: 600, letterSpacing: '0.02em',
                cursor: submitting || (post && !hasChanges) ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                background: submitBtnBg,
                color: '#fff',
                marginTop: '8px',
              }}
              onMouseEnter={e => {
                if (!submitting && (!post || hasChanges))
                  e.currentTarget.style.opacity = '0.85'
              }}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {submitting
                ? (post ? 'Updating...' : 'Publishing...')
                : (post ? 'Update post' : 'Publish post')}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}